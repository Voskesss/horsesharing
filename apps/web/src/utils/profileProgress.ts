// Centrale functie voor profiel volledigheid berekening

export interface ProfileProgressResult {
  percentage: number;
  totalQuestions: number;
  answeredQuestions: number;
  requiredTotal: number;
  requiredAnswered: number;
  requiredPercentage: number;
  isComplete: boolean;
}

export const calculateRiderProfileProgress = (riderProfile: any): ProfileProgressResult => {
  let totalRequired = 0;
  let answeredRequired = 0;
  let totalOptional = 0;
  let answeredOptional = 0;

  // VERPLICHTE VELDEN (bepalen progress percentage)
  
  // Basic info (7 verplichte vragen)
  totalRequired += 7;
  if (riderProfile.first_name) answeredRequired++;
  if (riderProfile.last_name) answeredRequired++;
  if (riderProfile.phone) answeredRequired++;
  if (riderProfile.date_of_birth) answeredRequired++;
  if (riderProfile.postcode) answeredRequired++;
  if (riderProfile.max_travel_distance_km > 0) answeredRequired++;
  if (riderProfile.transport_options?.length > 0) answeredRequired++;

  // Availability (4 verplichte vragen)
  totalRequired += 4;
  if (riderProfile.available_days?.length > 0) answeredRequired++;
  if (riderProfile.available_time_blocks?.length > 0) answeredRequired++;
  if (riderProfile.session_duration_min > 0) answeredRequired++;
  if (riderProfile.session_duration_max > 0) answeredRequired++;

  // Budget (2 verplichte vragen)
  totalRequired += 2;
  if (riderProfile.budget_min_euro > 0) answeredRequired++;
  if (riderProfile.budget_max_euro > 0) answeredRequired++;

  // Experience (2 verplichte vragen)
  totalRequired += 2;
  if (riderProfile.experience_years >= 0) answeredRequired++;
  if (riderProfile.certification_level) answeredRequired++;

  // Goals (3 verplichte vragen)
  totalRequired += 3;
  if (riderProfile.riding_goals?.length > 0) answeredRequired++;
  if (riderProfile.discipline_preferences?.length > 0) answeredRequired++;
  if (riderProfile.personality_style?.length > 0) answeredRequired++;

  // Tasks (1 verplichte vraag)
  totalRequired += 1;
  if (riderProfile.willing_tasks?.length > 0) answeredRequired++;

  // OPTIONELE VELDEN (voor matching kwaliteit)
  
  // Experience optioneel
  totalOptional += 2;
  if (riderProfile.previous_instructors?.length > 0) answeredOptional++;
  if (riderProfile.comfort_levels && Object.keys(riderProfile.comfort_levels).length > 0) answeredOptional++;

  // Goals optioneel
  totalOptional += 1;
  if (riderProfile.start_date) answeredOptional++;

  // Tasks optioneel
  totalOptional += 1;
  if (riderProfile.task_frequency && Object.keys(riderProfile.task_frequency).length > 0) answeredOptional++;

  // Preferences optioneel (materiaal en gezondheid zijn niet verplicht)
  totalOptional += 4;
  if (riderProfile.material_preferences && Object.keys(riderProfile.material_preferences).length > 0) answeredOptional++;
  if (riderProfile.insurance_coverage !== undefined) answeredOptional++;
  if (riderProfile.health_restrictions?.length > 0) answeredOptional++;
  if (riderProfile.no_gos?.length > 0) answeredOptional++;

  // Media optioneel
  totalOptional += 2;
  if (riderProfile.photos?.length > 0) answeredOptional++;
  if (riderProfile.video_intro_url) answeredOptional++;

  // Bereken percentages
  const requiredPercentage = totalRequired > 0 ? (answeredRequired / totalRequired) * 100 : 0;
  const optionalPercentage = totalOptional > 0 ? (answeredOptional / totalOptional) * 100 : 0;
  
  // Verplichte velden zijn 80%, optionele 20%
  const totalPercentage = Math.round((requiredPercentage * 0.8) + (optionalPercentage * 0.2));

  return {
    percentage: totalPercentage,
    totalQuestions: totalRequired + totalOptional,
    answeredQuestions: answeredRequired + answeredOptional,
    requiredTotal: totalRequired,
    requiredAnswered: answeredRequired,
    requiredPercentage: Math.round(requiredPercentage),
    isComplete: requiredPercentage >= 100
  };
};

export const calculateOwnerProfileProgress = (ownerProfile: any): ProfileProgressResult => {
  // Simpele implementatie voor owner - kan later uitgebreid worden
  const requiredFields = ['first_name', 'last_name', 'phone', 'postcode'];
  let answered = 0;
  
  requiredFields.forEach(field => {
    const value = ownerProfile[field];
    if (value !== null && value !== undefined && value !== '') {
      answered++;
    }
  });
  
  const percentage = Math.round((answered / requiredFields.length) * 100);
  
  return {
    percentage,
    totalQuestions: requiredFields.length,
    answeredQuestions: answered,
    requiredTotal: requiredFields.length,
    requiredAnswered: answered,
    requiredPercentage: percentage,
    isComplete: percentage >= 100
  };
};
