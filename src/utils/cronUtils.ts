const dateToCron = (date: Date) => {
	const minutes = date.getMinutes();
	const hours = date.getHours();
	const days = date.getDate();
	const months = date.getMonth() + 1;
	const dayOfWeek = date.getDay();

	return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
}

export default dateToCron;
