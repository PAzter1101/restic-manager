# =============================================================================
# Multi-stage Dockerfile for Restic Web Manager
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Frontend Builder (Node.js)
# -----------------------------------------------------------------------------
FROM node:22-alpine AS frontend-builder

# Set working directory
WORKDIR /app/frontend

# Install dependencies first (better caching)
COPY frontend/package*.json ./
RUN npm ci --silent

# Copy source and build
COPY frontend/ ./
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Python Dependencies Builder
# -----------------------------------------------------------------------------
FROM python:3.12-slim-bookworm AS python-builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# -----------------------------------------------------------------------------
# Stage 3: Runtime Image
# -----------------------------------------------------------------------------
FROM python:3.12-slim-bookworm AS runtime

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    restic \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy virtual environment from builder
COPY --from=python-builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy application code
COPY --chown=appuser:appuser app/ ./

# Copy built frontend from frontend-builder
COPY --from=frontend-builder --chown=appuser:appuser /app/app/static ./static

# Precompile Python files for faster startup
RUN python -m compileall -q .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/', timeout=5)"

# Expose port
EXPOSE 8000

# Run application
CMD ["python", "main.py"]
