

class OrbitDBActions {
  private openDb: any

  public constructor(openDb: any) {
    this.openDb = openDb
  }

  public async addData(data: any) {
    await this.openDb.add(data)
    return 'Data added'
  }

  public async putData(data: any) {
    await this.openDb.put(data)
    return 'Data added'
  }

  public async getData(hash: string) {
    const data = await this.openDb.get(hash)
    return data
  }

}