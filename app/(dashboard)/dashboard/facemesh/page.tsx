import BreadCrumb from '@/components/breadcrumb';
import FaceMesh from '@/components/facemesh/facemesh';
import { Heading } from '@/components/ui/heading';

const breadcrumbItems = [{ title: 'Facemesh', link: '/dashboard/facemesh' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Facemesh`} description="Swipe who you like!" />
        </div>

        <FaceMesh />
      </div>
    </>
  );
}
