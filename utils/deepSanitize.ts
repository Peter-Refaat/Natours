import sanitizeHtml from "sanitize-html";
import type { NextFunction, Request, Response } from "express";

type SanitizableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SanitizableValue[]
  | { [key: string]: SanitizableValue };

// recursive function to sanitize deeply nested objects against XSS attacks
const deepSanitize = function (val: SanitizableValue): SanitizableValue {
  if (typeof val === "string") {
    return sanitizeHtml(val, {
      allowedTags: [
        "b",
        "i",
        "em",
        "strong",
        "ul",
        "ol",
        "li",
        "p",
        "br",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "a",
        "img",
      ],
      allowedAttributes: {
        a: ["href", "target"],
        img: ["src", "alt", "width", "height"],
      },
      allowedSchemes: ["http", "https"],
    });
  }
  if (Array.isArray(val)) {
    return val.map((item) => deepSanitize(item));
  }
  if (typeof val === "object" && val !== null) {
    Object.keys(val).forEach((key) => {
      val[key] = deepSanitize(val[key]);
    });
    return val;
  }
  return val;
};

const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) req.body = deepSanitize(req.body);
  if (req.query) req.query = deepSanitize(req.query) as typeof req.query;
  if (req.params) req.params = deepSanitize(req.params) as typeof req.params;

  next();
};

export default xssSanitizer;
