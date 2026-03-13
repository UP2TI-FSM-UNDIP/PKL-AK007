import { auth } from "./src/lib/auth.ts";

console.log("Auth API keys:", Object.keys(auth.api));
if (auth.api.createSession) {
    console.log("createSession found!");
} else {
    console.log("createSession NOT found.");
}
process.exit(0);
