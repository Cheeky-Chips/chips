import { GameObject } from "../object";

export interface Component {
  getTarget(): GameObject;
  onBind(): void;
  onObjectUpdate(): void;
}
