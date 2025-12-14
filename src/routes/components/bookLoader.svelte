<div class="book">
	<div class="page z-10 bg-gray-500"></div>
	<div class="page bg-gray-400"></div>
	<div class="page bg-gray-400"></div>
	<div class="page bg-gray-400"></div>
	<div class="page bg-gray-400"></div>
	<div class="page z-10 bg-gray-500"></div>
</div>

<style>
	:root {
		--duration: 1.5s;
	}
	.book {
		width: 64px;
		height: 40px;
		position: relative;
	}
	.page {
		width: 50%;
		height: 10%;
		position: absolute;
		right: 0;
		bottom: 0;
		border-radius: 0 10px 10px 0;
		transform-origin: 0% 50%;
		animation: open var(--duration) infinite;
	}
	.page:nth-child(1) {
		height: 15%;
		animation-delay: calc(var(--duration) * 0);
	}
	.page:nth-child(2) {
		animation-delay: calc(var(--duration) / 25);
	}
	.page:nth-child(3) {
		animation-delay: calc(var(--duration) / 12.5);
	}

	.page:nth-child(4) {
		animation-delay: calc(var(--duration) / 8.5);
	}
	.page:nth-child(5) {
		animation-delay: calc(var(--duration) / 6.5);
	}
	.page:nth-child(6) {
		height: 15%;
		animation-delay: calc(var(--duration) / 5.3);
	}
	@keyframes open {
		0% {
			transform: rotateZ(0deg);
			visibility: visible;
		}
		40% {
			transform: rotateZ(-180deg);
			visibility: visible;
		}
		80% {
			transform: rotateZ(-180deg);
			visibility: visible;
		}
		80.01% {
			transform: rotateZ(0deg);
			visibility: hidden;
		}
		100% {
			transform: rotateZ(0deg);
			visibility: hidden;
		}
	}
</style>
