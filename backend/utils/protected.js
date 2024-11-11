import jwt from "jsonwebtoken";

export async function protect(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Zugriff verweigert. Kein Token gefunden." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      message: "Zugriff auf geschützte Route gewährt",
      userId: decoded.userId,
    });
  } catch (error) {
    res.status(401).json({ message: "Ungültiges Token" });
  }
}
