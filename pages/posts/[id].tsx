import Layout from "../../components/layout";
import { getPostNames, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from '../../styles/utils.module.css';


type Props = Awaited<ReturnType<typeof getStaticProps>>["props"];


export default function Post({ postData }: Props) {
    return (
      <Layout home>
        <Head>
          <title>{postData.title}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: postData.content }} />
        </article>
      </Layout>
    );
  }


export const getStaticPaths = async () => {
    const paths = getPostNames();
    return {
        paths,
        fallback: false
    }
}


export const getStaticProps = async ({ params }) => {

    const postData = await getPostData(params.id);

    return {
        props: {
            postData
        }
    }

}
