import { getAuthToken } from "@/app/_utils/services/getAuthToken"
import { getStrapiCartData } from "@/app/_utils/services/getStrapiData"

const Cart = async () => {
	const authToken = await getAuthToken()
	const { data } = await getStrapiCartData(`user-carts?filters[session_id][$eq]=${authToken}&populate=*`, authToken)

	console.log(data?.map(cartItem => cartItem.attributes))

	return (
		<article className="max-container my-24 mx-4">
			<h1>Warenkorb</h1>
			{/* {data?.length > 0 && <section>{data?.map(cartItem => cartItem.attributes)}</section>} */}
		</article>
	)
}

export default Cart
