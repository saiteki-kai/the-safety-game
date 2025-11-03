export default function Prova() {
	console.log("Prova component rendered");

	return (
		<div>
			<button
				type="submit"
				onClick={async () => {
					console.log("Button clicked");

					const response = await fetch("/api/register");

					console.log("Insert Result:", await response.text());

					alert("Clicked!");
				}}
			>
				Insert
			</button>
		</div>
	);
}
