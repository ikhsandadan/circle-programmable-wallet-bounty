"use client";
import { usePathname } from 'next/navigation';
import Frontpage from './Frontpage/page';

const Home = () => {
  const pathName = usePathname();

  return (
    <>
      {pathName === '/' && <Frontpage />}
    </>
  );
}

export default Home;