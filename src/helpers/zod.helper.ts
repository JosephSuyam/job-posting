import { ZodError, ZodIssue } from 'zod'

export function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]]
}

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue;
  const pathString = path.slice(-1);

  return `${pathString}: ${message}`;
}

export const formatZodError = (error: ZodError): string | undefined => {
  const { issues } = error;

  if (issues.length) {
    const currentIssue = issues[0]

    return formatZodIssue(currentIssue);
  }
}