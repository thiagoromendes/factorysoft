import { GetStaticPaths, GetStaticProps } from "next";
import Link from 'next/link';
import { useRouter } from "next/router";
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDOM from 'prismic-dom';

import { client } from "@/lib/prismic";
interface CategoryProps {
    category: Document;
    posts: Document[]
}

export default function Category({category, posts}: CategoryProps) {
    const router = useRouter();

    if (router.isFallback) {
        return <p>Carregando...</p>
    }

    return (
        <div>
            <h1>
                {PrismicDOM.RichText.asText(category.data.title)}
            </h1>
            <ul>
            {posts.map(post => {
                return (
                <li key={post.id}>
                    <Link href={`/catalog/post/${post.uid}`}>
                        <a>
                        {PrismicDOM.RichText.asText(post.data.title)}
                        </a>
                    </Link>
                  </li>
                )
            })}
            </ul>
        </div>
    )
}



export const getStaticPaths: GetStaticPaths = async () => {
    const categories = await client().query([
        Prismic.Predicates.at('document.type','category')
    ])

    const paths = categories.results.map(category => {
        return {
            params: { slug: category.uid }
        }
    })

    return {
        paths,
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const { slug } = context.params;
    
    const category = await client().getByUID('category',String(slug), {});
    const posts = await client().query([
        Prismic.Predicates.at('document.type','post'),
        Prismic.Predicates.at('my.post.category', category.id)
    ])

    return {
        props: {
            posts: posts.results,
            category
        },
        revalidate: 5
    }
}