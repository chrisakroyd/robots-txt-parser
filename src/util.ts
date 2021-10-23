import isAbsolute from 'is-absolute-url';

export const hasHttpProtocol = (protocol: string) =>
  protocol === 'http:' || protocol === 'https:';

export const addProtocol = (link: string) => `http://${link}`;

export const isFunction = (value: unknown) => typeof value === 'function';

export const formatLink = (rawLink: string) => {
  let link = rawLink;
  // No protocol on the link, this can screw up url parsing with node url
  // so add a protocol and then parse.
  if (!isAbsolute(link)) {
    link = addProtocol(link);
  }
  const parsedLink = new URL(link);

  // The protocol the link has is non-http, therefore we give it a http based protocol.
  if (!hasHttpProtocol(parsedLink.protocol)) {
    parsedLink.protocol = 'http:';
  }
  // Return the base link.
  return `${parsedLink.protocol}//${parsedLink.hostname}`;
};

/*
 * Calculates the number of records that apply for the
 * given path and the maximum specificity of all
 * the records which apply.
 */
export const applyRecords = (
  path: string,
  records: {
    specificity: number;
    path: RegExp;
  }[],
) => {
  let numApply = 0;
  let maxSpecificity = 0;

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    if (record.path.test(path)) {
      numApply += 1;
      if (record.specificity > maxSpecificity) {
        maxSpecificity = record.specificity;
      }
    }
  }

  return {
    numApply,
    maxSpecificity,
  };
};
