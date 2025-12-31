export function validateAcademicLevel(academicLevel: string): boolean {
	if (academicLevel.match(/^[0-9]+$/)) {
		const academicLevelAsNumber = parseInt(academicLevel);
		if (academicLevelAsNumber >= 1 && academicLevelAsNumber <= 12) {
			return true;
		} else {
			return false;
		}
	} else {
		if (academicLevel === 'UG' || academicLevel === 'G' || academicLevel === 'PG') {
			return true;
		} else {
			return false;
		}
	}
}
