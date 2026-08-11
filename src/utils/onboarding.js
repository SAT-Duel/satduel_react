export function needsFullOnboarding(user) {
    return Boolean(user?.onboarding_required && (
        user?.grade_selected !== true || user?.username_finalized === false
    ));
}

export function incompleteOnboardingSections(user) {
    return [
        ...(user?.sat_exam_date_selected === true ? [] : ['sat-date']),
        ...(user?.terms_accepted && typeof user?.marketing_opt_in === 'boolean' ? [] : ['privacy']),
    ];
}
