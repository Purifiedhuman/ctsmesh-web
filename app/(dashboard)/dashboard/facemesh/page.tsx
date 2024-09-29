import BreadCrumb from '@/components/breadcrumb';
import FaceMesh from '@/components/facemesh/facemesh';
import { Heading } from '@/components/ui/heading';

const breadcrumbItems = [{ title: 'Cook', link: '/dashboard/facemesh' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-1 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-center">
          <Heading title={`Lets Cook!`} description="Swipe the alpha post! Gas is sponsored!" />
        </div>

        <FaceMesh />
      </div>
    </>
  );
}
