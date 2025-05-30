'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row ,Spinner,Card, Dropdown} from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import widget/custom components
import { HighlightCode }  from 'widgets';



// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, 
    FlightPerformance 
} from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import { useUser } from 'context/userContext'; 

const Home = () => {
    
    const router = useRouter()
    
    useEffect(() => {
        const verificarSesion = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/get_session`, {
              credentials: 'include',
            });
    
            if (res.status === 401) {
              router.push('/authentication/sign-in');
              return;
            }
    
            const data = await res.json();
            if (!data.usuario) {
              router.push('/authentication/sign-in');
              return;
            }
    
            // Guardar el usuario en estado si lo necesitas en el componente
            
            router.push('/admin');
          } catch (err) {
            router.push('/authentication/sign-in');
          }
        };
    
        verificarSesion();
    }, [router]);

    
    return (
        <></>
    )
}
export default Home;