// pages/[slug].tsx

import React from 'react';
import { GetServerSideProps } from 'next';

interface DynamicPageProps {
  data: {
    title: string;
    // Other data properties with default values
  };
}

const DynamicPage: React.FC<DynamicPageProps> = ({ data }) => {
  return (
    <div>
      <h1>{data.title}</h1>
      {/* Other content */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<DynamicPageProps> = async (context) => {
  // Fetch data based on the dynamic parameter (slug in this case)
  const { params } = context;
  const slug = params?.slug as string;

  // Fetch data from your API or other data source
  const fetchData = async () => {
    // Perform your data fetching logic
    // ...

    // Return the fetched data
    return {
      title: 'Default Title', // Set default value for title
      // Other data properties with default values
    };
  };

  const data = await fetchData();

  // Return the props with the fetched data
  return {
    props: {
      data,
    },
  };
};

export default DynamicPage;
