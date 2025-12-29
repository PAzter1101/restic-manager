export class SizeLoader {
  constructor(api) {
    this.api = api;
  }

  async loadSizesAsync(snapshots, onUpdate) {
    const promises = snapshots.map(async (snapshot, index) => {
      if (snapshot.size) return;
      
      try {
        const sizeData = await this.api.getSnapshotSize(snapshot.short_id);
        snapshot.size = sizeData.size;
        onUpdate(index, snapshot.size);
      } catch (error) {
        console.warn(`Не удалось загрузить размер для ${snapshot.short_id}:`, error);
      }
    });

    await Promise.all(promises);
  }
}
