/**
 * The folder sub-components contains sub component of all the pages,
 * so here you will find folder names which are listed in root pages.
 */

// sub components for /pages/dashboard
import ActiveProjects from 'sub-components/dashboard/ActiveProjects';
import TasksPerformance from 'sub-components/dashboard/TasksPerformance';
import FlightPerformance from 'sub-components/dashboard/FlightPerformance';
import Teams from 'sub-components/dashboard/Teams';

// sub components for /pages/profile
import AboutMe from 'sub-components/profile/AboutMe';
import ActivityFeed from 'sub-components/profile/ActivityFeed';
import MyTeam from 'sub-components/profile/MyTeam';
import ProfileHeader from 'sub-components/profile/ProfileHeader';
import ProjectsContributions from 'sub-components/profile/ProjectsContributions';
import RecentFromBlog from 'sub-components/profile/RecentFromBlog';

// sub components for /pages/billing
import CurrentPlan from 'sub-components/billing/CurrentPlan';
import BillingAddress from 'sub-components/billing/BillingAddress';

// sub components for /pages/settings
import DeleteAccount from 'sub-components/settings/DeleteAccount';
import EmailSetting from 'sub-components/settings/EmailSetting';
import GeneralSetting from 'sub-components/settings/GeneralSetting';
import Notifications from 'sub-components/settings/Notifications';
import Preferences from 'sub-components/settings/Preferences';

import FlightSetting from 'sub-components/flight/FlightSetting';
import FlightUpdate from 'sub-components/flight/FlightUpdate';

import PlaneSetting from 'sub-components/plane/PlaneSetting';
import PlaneUpdate from 'sub-components/plane/PlaneUpdate';

import WorkerSetting from 'sub-components/worker/WorkerSetting';
import WorkerUpdate from 'sub-components/worker/WorkerUpdate';

import PaysheetSetting from 'sub-components/paysheet/PaysheetSetting';
import PaysheetUpdate from 'sub-components/paysheet/PaysheetUpdate';


import SuitcaseSetting from 'sub-components/suitcase/SuitcaseSetting';


export {
   ActiveProjects,
   TasksPerformance,
   FlightPerformance,
   Teams,
   
   AboutMe,
   ActivityFeed,
   MyTeam,
   ProfileHeader,
   ProjectsContributions,
   RecentFromBlog,

   CurrentPlan,
   BillingAddress,

   DeleteAccount, 
   EmailSetting,  
   GeneralSetting, 
   Notifications, 
   Preferences,

   FlightSetting,
   FlightUpdate,

   PlaneSetting,
   PlaneUpdate,

   WorkerSetting,
   WorkerUpdate,

   PaysheetSetting,
   PaysheetUpdate,

   SuitcaseSetting
};
