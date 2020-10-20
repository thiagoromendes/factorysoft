import {useRouter} from 'next/router'

export default function Example() {

    const router = useRouter();

    return <h1>{router.query.examplequery}</h1>
}