export const removeCodeFences = (result: string): string => {
  if (result?.startsWith("```json")) {
    result = result.replace("```json", "");
  }
  if (result?.endsWith("```")) {
    result = result.replace("```", "");
  }
  return result;
};
