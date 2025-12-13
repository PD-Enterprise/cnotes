<div class="book">
	<div class="page"></div>
	<div class="page"></div>
	<div class="page"></div>
</div>

<style>
	.book {
		--color: #9ca3af; /* gray-400 */
		--duration: 1.5s;
		width: 64px;
		height: 40px;
		position: relative;
		perspective: 150px;
	}
	.page {
		width: 50%;
		height: 100%;
		position: absolute;
		right: 0;
		border: 4px solid var(--color);
		border-radius: 0 5px 5px 0;
		background-color: hsl(var(--b1)); /* base-100 */
		transform-origin: 0% 50%;
		animation: open var(--duration) ease-in-out infinite;
	}
	.page:nth-child(1) {
		animation-delay: calc(var(--duration) * 0);
	}
	.page:nth-child(2) {
		animation-delay: calc(var(--duration) / 4);
	}
	.page:nth-child(3) {
		animation-delay: calc(var(--duration) / 2);
	}
	@keyframes open {
		0% {
			transform: rotateY(0deg);
		}
		20% {
			transform: rotateY(-160deg);
		}
		50%,
		100% {
			transform: rotateY(-180deg);
		}
	}
</style>