/**
 * Gender enum for user profiles and preferences
 * This is used for both the user's own gender and their preferred gender in matches
 */
export const Gender = {
  MAN: 'man',
  WOMAN: 'woman',
  TRANS_MAN: 'trans_man',
  TRANS_WOMAN: 'trans_woman',
  NON_BINARY: 'non_binary',
  OTHER: 'other'
};

/**
 * Gender display names for UI
 */
export const GenderDisplay = {
  [Gender.MAN]: 'Man',
  [Gender.WOMAN]: 'Woman',
  [Gender.TRANS_MAN]: 'Trans Man',
  [Gender.TRANS_WOMAN]: 'Trans Woman',
  [Gender.NON_BINARY]: 'Non-binary',
  [Gender.OTHER]: 'Other'
};

/**
 * Get all gender options for dropdowns
 */
export const getGenderOptions = () => {
  return Object.entries(GenderDisplay).map(([value, label]) => ({
    value,
    label
  }));
}; 