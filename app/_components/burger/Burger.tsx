import styles from "./Burger.module.css"

interface BurgerProps {
	isActive: boolean
}

const Burger = ({ isActive }: BurgerProps) => {
	return (
		<div className={`${styles.burger} ${isActive ? styles["burger--open"] : ""}`}>
			<div className={styles["burger__stick"]} />
		</div>
	)
}

export default Burger
