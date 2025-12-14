import type { note } from '../../routes/types';
import { selectedAcademicLevel, selectedSort, selectedTopic } from '../stores/store.svelte';

export function getFilteredAndSortedNotes(notesStore: any) {
	let filtered = notesStore.value;

	// Filter by grade
	if (
		selectedAcademicLevel.value &&
		selectedAcademicLevel.value !== 'all' &&
		selectedAcademicLevel.value !== ''
	) {
		filtered = filtered.filter(
			(note: note) => Number(note.academicLevel) === Number(selectedAcademicLevel.value)
		);
	}
	// Filter by subject
	if (selectedTopic.value && selectedTopic.value !== 'all' && selectedTopic.value !== '') {
		filtered = filtered.filter((note: note) => note.topic === selectedTopic.value);
	}

	// Sort
	switch (selectedSort.value) {
		case 'academicLevel':
			filtered = filtered
				.slice()
				.sort((a, b) => (Number(a.academicLevel) ?? 0) - (Number(b.academicLevel) ?? 0));
			break;
		case 'topic':
			filtered = filtered.slice().sort((a, b) => (a.topic || '').localeCompare(b.topic || ''));
			break;
	}
	return filtered;
}
