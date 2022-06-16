import { escortID } from '../types/DataManager'

declare abstract class DataManager<Escort> {
  private _escorts: Map<escortID, Escort>
}
