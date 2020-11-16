import { GetServerSideProps } from 'next';
import Link from 'next/link';
import styled from 'styled-components'
import Prismic from  'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Title } from '@/styles/pages/home'
import { Document } from 'prismic-javascript/types/documents';
import SEO from '@/components/SEO'
import { client } from '@/lib/prismic';
interface HomeProps {
  recommendedProducts: Document[]
}

const Background = styled.div`
  flex: 1;
  background: url('../../static/backgroundImg.png') no-repeat center;
  background-size: cover;
`;

export default function Home({recommendedProducts}: HomeProps) {

  return (
    
    <Background>
      <SEO 
        title="FactorySoft, o jeito certo de criar software" 
        shouldExcludeTitleSuffix 
        image="banner.png"
      />
      
      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/catalog/post/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDOM.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
      
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'post')
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    }
  }
}
