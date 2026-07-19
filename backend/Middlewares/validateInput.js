export const validateTextInput = (req, res, next) => {
  const { text } = req.body;
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Text content is required for analysis."
    });
  }
  next();
};
