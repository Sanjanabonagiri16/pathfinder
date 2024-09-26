import "@/styles/globals.css";
import "@/styles/animations.css";
import Layout from '../components/Layout';
import { AuthProvider } from '../hooks/useAuth';
import { AnimatePresence } from 'framer-motion';

function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
