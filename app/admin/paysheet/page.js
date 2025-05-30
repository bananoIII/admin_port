'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row ,Spinner} from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import widget/custom components
import { HighlightCode }  from 'widgets';
import DataTable from 'react-data-table-component';

import {
	Briefcase,
    ListTask,
    People,
    Bullseye
} from 'react-bootstrap-icons';

// import react code data file
import {
    BorderSpinnerCode,
    SpinnersColorsCode,
    GrowingSpinnerCode,
    GrowColorsCode,
    AlignmentCode,
    PlacementCenterCode,
    PlacementLoadingCode,
    FloatsCode,
    TextAlignCode,
    SizeSpinnersCode,
    StyleCSSCode,
    ButtonsCode,
    Buttons2Code
} from 'data/code/SpinnersCode';

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, 
    TasksPerformance 
} from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import { useUser } from 'context/userContext'; 


const Home = () => {
    const [general, setgeneral] = useState([]);

    useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/payrolls/resumen-general`)
        .then(res => res.json())
        .then(data => setgeneral(data))
        .catch(err => console.error('Error cargando nóminas:', err));
    }, []);


    const payrollsStats = [
    {
        id: 1,
        title: "Ganancias Totales",
        value: general?.total_earnings !== undefined
        ? '$ ' + general.total_earnings.toLocaleString(undefined, { minimumFractionDigits: 2 })
        : 'Cargando...',
        icon: <Briefcase size={18} />,
        statInfo: "<span className='text-dark me-2'>N/A</span>"
    },
    {
        id: 2,
        title: "Deducciones Totales",
        value: general?.total_deductions !== undefined
        ? '$ ' + general.total_deductions.toLocaleString(undefined, { minimumFractionDigits: 2 })
        : 'Cargando...',
        icon: <ListTask size={18} />,
        statInfo: "<span className='text-dark me-2'>N/A</span>"
    },
    {
        id: 3,
        title: "Neto Pagado",
        value: general?.net_pay !== undefined
        ? '$ ' + general.net_pay.toLocaleString(undefined, { minimumFractionDigits: 2 })
        : 'Cargando...',
        icon: <People size={18} />,
        statInfo: "<span className='text-dark me-2'>N/A</span>"
    },
    {
        id: 4,
        title: "Número de Nóminas",
        value: general?.payrolls?.length !== undefined
        ? general.payrolls.length
        : 'Cargando...',
        icon: <Bullseye size={18} />,
        statInfo: general?.payrolls?.length !== undefined
        ? `<span className='text-dark me-2'>${general.payrolls.length} Nóminas</span>`
        : 'Cargando...'
    }
    ];
      
  
    const router = useRouter()
    const { usuario,setUsuario } = useUser();
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
            setUsuario(data.usuario);
          } catch (err) {
            router.push('/authentication/sign-in');
          }
        };
    
        verificarSesion();
    }, [router]);
    
    if (!usuario) {
        return <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>; // o spinner
    }
    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        {/* Page header */}
                        <div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0  text-white">Aviones </h3>
                                </div>
                                <div>
                                    <Link href="/admin/paysheet/generate" className="btn btn-white">Nómina nueva</Link>
                                </div>
                            </div>
                        </div>
                    </Col>
                    {payrollsStats.map((item, index) => {
                        return (
                            <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                                <StatRightTopIcon info={item} />
                            </Col>
                        )
                    })}
                </Row>
                <PayrollList setgeneral={setgeneral} />
            </Container>
        </Fragment>
    )
}
export default Home;


const PayrollList = () => {
  const [payrolls, setpayrolls] = useState([]);

  const router = useRouter()
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/payrolls/resumen-general`)
      .then(res => res.json())
      .then(data => setpayrolls(data))
      .catch(err => console.error('Error cargando nóminas:', err));
  }, []);

 
  const handleViewDetails = (payrollId) => {
    router.push(`/admin/paysheet/${payrollId}`);
};

  const columns = [
    { name: 'Fecha de pago', selector: row => row.payment_date, sortable: true },
    { name: 'Total Ganancias', selector: row => row.total_earnings.toLocaleString(undefined, { minimumFractionDigits: 2 }), sortable: true },
    { name: 'Total Deducciones', selector: row => row.total_deductions.toLocaleString(undefined, { minimumFractionDigits: 2 }), sortable: true },
    { name: 'Neto Pagado', selector: row => row.net_pay.toLocaleString(undefined, { minimumFractionDigits: 2 }), sortable: true },
    {
      name: 'Acciones',
      cell: row => (
        <button
          onClick={() => handleViewDetails(row._id)}
          className="btn btn-sm btn-primary"
        >
          Ver detalles
        </button>
      ),
    },
  ];
  

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Nóminas</h2>
      <DataTable
        columns={columns}
        data={payrolls.payrolls}
        pagination
        responsive
        striped
        highlightOnHover
        noDataComponent="No hay aviones disponibles."
      />
    </div>
  );
};


