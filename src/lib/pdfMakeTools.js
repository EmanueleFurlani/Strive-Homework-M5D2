import PdfPrinter from "pdfmake";

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

export const getBlogPostPDFReadableStream = async (blogPost) => {
  const printer = new PdfPrinter(fonts);
 
  const docDefinition = {
    content: [
      {
        text: blogPost.title,
        style: "header",
      },
      "\n\n\n",
      blogPost.content,
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
    },
  };
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);

  pdfReadableStream.end();
  return pdfReadableStream;
};
