import { GetServerSideProps } from 'next';
import { Title } from '@/styles/pages/home'

import SEO from '@/components/SEO'

interface Product {
  id: string;
  title: string
}

interface HomeProps {
  recommendedProducts: Product[]
}

export default function Home({recommendedProducts}: HomeProps) {

  return (
    <div>
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
                {recommendedProduct.title}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommended`);
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts
    }
  }
}
