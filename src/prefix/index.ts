// Re-export registry functions
export {
  registerPrefixCommand,
  getPrefixCommand,
  getAllPrefixCommands,
  type PrefixCommand,
} from "./registry";

// Load all commands
import "./ping";
import "./help";
import "./anime";
import "./donate";
import "./setup";
import "./sync";
import "./upgrades";
import "./language";
import "./quality";
import "./what";
import "./propers";
import "./docs";
import "./github";
import "./support";
import "./coc";
import "./dv";
import "./trick";
import "./delay";
import "./scoring";
import "./readme";
import "./indexers";
import "./trash";