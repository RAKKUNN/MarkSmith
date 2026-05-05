declare module 'markdown-it-texmath' {
  import MarkdownIt from 'markdown-it';
  interface TexMathOptions {
    engine: any;
    delimiters: string;
    katexOptions?: Record<string, any>;
  }
  function texmath(md: MarkdownIt, options?: TexMathOptions): void;
  export = texmath;
}
