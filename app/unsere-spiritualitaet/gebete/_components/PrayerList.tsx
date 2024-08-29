import PrayerItem from "./PrayerItem"

const PrayerList = ({ content }) => {
	return (
		<div>
			{content.map((prayerItem, index) => (
				<section key={`PrayerItem_${index}`}>
					<PrayerItem prayerItem={prayerItem} />
				</section>
			))}
		</div>
	)
}

export default PrayerList
