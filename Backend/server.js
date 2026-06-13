if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0;
      this.d = 1; this.e = 0; this.f = 0;
    }
    static fromMatrix() { return new DOMMatrix(); }
    static fromFloat32Array() { return new DOMMatrix(); }
    static fromFloat64Array() { return new DOMMatrix(); }
    translate() { return this; }
    scale() { return this; }
    multiply() { return this; }
    inverse() { return this; }
    transformPoint(p) { return p; }
  };
}

require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})