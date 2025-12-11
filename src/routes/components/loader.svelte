<script lang="ts">
	let props = $props();
</script>

<div class="bg-base-200 fixed inset-0 z-50 flex flex-col items-center justify-center gap-10">
	<div class="book-container">
		<div class="book">
			<div class="book-cover front">
				<div class="cover-texture"></div>
				<div class="cover-spine"></div>
				<div class="cover-title">C</div>
			</div>
			<div class="page page-1">
				<div class="page-content"></div>
			</div>
			<div class="page page-2">
				<div class="page-content"></div>
			</div>
			<div class="page page-3">
				<div class="page-content"></div>
			</div>
			<div class="page page-4">
				<div class="page-content"></div>
			</div>
			<div class="page page-5">
				<div class="page-content"></div>
			</div>
			<div class="book-cover back">
				<div class="cover-texture"></div>
			</div>
		</div>
	</div>
	<p class="text-base-content/70 text-lg font-medium">{props.title}</p>
</div>

<style>
	.book-container {
		perspective: 1200px;
		width: 120px;
		height: 160px;
	}

	.book {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transform: rotateY(-25deg) rotateX(10deg);
		animation: bookFloat 3s ease-in-out infinite;
	}

	@keyframes bookFloat {
		0%, 100% {
			transform: rotateY(-25deg) rotateX(10deg) translateY(0);
		}
		50% {
			transform: rotateY(-25deg) rotateX(10deg) translateY(-8px);
		}
	}

	.book-cover {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 2px 6px 6px 2px;
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}

	.book-cover.front {
		background: linear-gradient(135deg, #8B4513 0%, #654321 50%, #5D3A1A 100%);
		transform-origin: left center;
		animation: coverOpen 2.5s ease-in-out infinite;
		box-shadow: 
			inset 0 0 30px rgba(0, 0, 0, 0.3),
			inset -3px 0 10px rgba(0, 0, 0, 0.2),
			2px 2px 8px rgba(0, 0, 0, 0.4);
		z-index: 10;
	}

	.book-cover.front::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: 
			repeating-linear-gradient(
				90deg,
				transparent,
				transparent 2px,
				rgba(139, 69, 19, 0.1) 2px,
				rgba(139, 69, 19, 0.1) 4px
			);
		border-radius: 2px 6px 6px 2px;
		pointer-events: none;
	}

	.cover-texture {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: 
			url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		opacity: 0.08;
		border-radius: 2px 6px 6px 2px;
		mix-blend-mode: overlay;
	}

	.cover-spine {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 8px;
		background: linear-gradient(90deg, #3D2314 0%, #654321 50%, #4A3728 100%);
		border-radius: 2px 0 0 2px;
		box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.3);
	}

	.cover-title {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 36px;
		font-weight: bold;
		color: #D4AF37;
		text-shadow: 
			1px 1px 2px rgba(0, 0, 0, 0.5),
			0 0 10px rgba(212, 175, 55, 0.3);
		font-family: 'Georgia', serif;
	}

	.cover-title::before {
		content: '';
		position: absolute;
		top: -15px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px;
		height: 2px;
		background: linear-gradient(90deg, transparent, #D4AF37, transparent);
	}

	.cover-title::after {
		content: '';
		position: absolute;
		bottom: -15px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px;
		height: 2px;
		background: linear-gradient(90deg, transparent, #D4AF37, transparent);
	}

	@keyframes coverOpen {
		0%, 15% {
			transform: rotateY(0deg);
		}
		40%, 60% {
			transform: rotateY(-160deg);
		}
		85%, 100% {
			transform: rotateY(0deg);
		}
	}

	.book-cover.back {
		background: linear-gradient(135deg, #654321 0%, #5D3A1A 50%, #4A3728 100%);
		transform: translateZ(-12px);
		box-shadow: 
			inset 0 0 20px rgba(0, 0, 0, 0.4),
			-2px 2px 8px rgba(0, 0, 0, 0.3);
	}

	.page {
		position: absolute;
		width: calc(100% - 8px);
		height: calc(100% - 8px);
		top: 4px;
		left: 8px;
		background: linear-gradient(to right, #F5F5DC 0%, #FFFEF0 20%, #FFF8E7 100%);
		border-radius: 0 4px 4px 0;
		transform-origin: left center;
		transform-style: preserve-3d;
		backface-visibility: hidden;
		box-shadow: 
			inset 0 0 10px rgba(139, 90, 43, 0.1),
			inset -5px 0 15px rgba(0, 0, 0, 0.05);
	}

	.page::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: 
			repeating-linear-gradient(
				to bottom,
				transparent,
				transparent 18px,
				rgba(200, 180, 160, 0.2) 18px,
				rgba(200, 180, 160, 0.2) 19px
			);
		border-radius: 0 4px 4px 0;
	}

	.page-content {
		position: absolute;
		top: 15%;
		left: 10%;
		right: 10%;
		bottom: 15%;
		background: 
			repeating-linear-gradient(
				to bottom,
				rgba(100, 80, 60, 0.15) 0px,
				rgba(100, 80, 60, 0.15) 2px,
				transparent 2px,
				transparent 12px
			);
	}

	.page-1 {
		transform: translateZ(-2px);
		animation: pageFlip1 2.5s ease-in-out infinite;
	}

	.page-2 {
		transform: translateZ(-4px);
		animation: pageFlip2 2.5s ease-in-out infinite;
	}

	.page-3 {
		transform: translateZ(-6px);
		animation: pageFlip3 2.5s ease-in-out infinite;
	}

	.page-4 {
		transform: translateZ(-8px);
		animation: pageFlip4 2.5s ease-in-out infinite;
	}

	.page-5 {
		transform: translateZ(-10px);
		background: linear-gradient(to right, #EDE8D0 0%, #F5F0E0 100%);
	}

	@keyframes pageFlip1 {
		0%, 20% {
			transform: translateZ(-2px) rotateY(0deg);
		}
		45%, 55% {
			transform: translateZ(-2px) rotateY(-150deg);
		}
		80%, 100% {
			transform: translateZ(-2px) rotateY(0deg);
		}
	}

	@keyframes pageFlip2 {
		0%, 25% {
			transform: translateZ(-4px) rotateY(0deg);
		}
		48%, 52% {
			transform: translateZ(-4px) rotateY(-145deg);
		}
		77%, 100% {
			transform: translateZ(-4px) rotateY(0deg);
		}
	}

	@keyframes pageFlip3 {
		0%, 30% {
			transform: translateZ(-6px) rotateY(0deg);
		}
		50%, 50% {
			transform: translateZ(-6px) rotateY(-140deg);
		}
		75%, 100% {
			transform: translateZ(-6px) rotateY(0deg);
		}
	}

	@keyframes pageFlip4 {
		0%, 35% {
			transform: translateZ(-8px) rotateY(0deg);
		}
		52%, 48% {
			transform: translateZ(-8px) rotateY(-135deg);
		}
		73%, 100% {
			transform: translateZ(-8px) rotateY(0deg);
		}
	}
</style>
