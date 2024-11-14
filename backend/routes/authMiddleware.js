import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // JWT aus dem Header extrahieren

  if (!token) {
    return res.status(401).json({ message: "Kein Token, Zugriff verweigert" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token validieren
    req.userId = decoded.userId; // Benutzer-ID aus dem Token extrahieren
    next(); // Weiter zur nächsten Middleware oder Route
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Ungültiges Token, Zugriff verweigert" });
  }
}
