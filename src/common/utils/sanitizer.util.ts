import { JSDOM } from 'jsdom';
import * as createDOMPurify from 'dompurify';

const { window } = new JSDOM('');

const DOMPurify = createDOMPurify(window as any);

export const sanitize = (html: string, config?: createDOMPurify.Config) => {
  return DOMPurify.sanitize(html, config);
};
