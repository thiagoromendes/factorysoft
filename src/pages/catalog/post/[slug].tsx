import { GetStaticPaths, GetStaticProps } from "next";
import Link from 'next/link';
import { useRouter } from "next/router";
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDOM from 'prismic-dom';

import { client } from "@/lib/prismic";

interface PostProps {
    post: Document
}

export default function Post({post}:PostProps) {

    const router = useRouter();

    if (router.isFallback) {
        return <p>Carregando...</p>
    }

    console.log(post.data)

    return (
        <div>
             <h1>
             {PrismicDOM.RichText.asText(post.data.title)}
            </h1>
            <img src={post.data.image.url} width="400" alt=""/>
            <div dangerouslySetInnerHTML={{__html: PrismicDOM.RichText.asHtml(post.data.description)}} />
        </div>
       
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
    const { slug } = context.params;
    
    const post = await client().getByUID('post',String(slug), {});

    return {
        props: {
            post,
        },
        revalidate: 5
    }
}