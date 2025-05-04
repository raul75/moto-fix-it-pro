
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Tools, Award, Clock, Check, Phone } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const Workshop = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-motofix-blue to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                {t('workshop.title')}
              </h1>
              <p className="text-xl opacity-90">
                {t('workshop.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate('/services')} className="bg-white text-blue-900 hover:bg-gray-100">
                  {t('workshop.services')}
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/contact')} className="border-white text-white hover:bg-white/10">
                  {t('workshop.contact')}
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/workshop-hero.jpg" 
                alt="Workshop" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('workshop.services')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('workshop.servicesDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Wrench className="h-10 w-10" />, title: t('workshop.serviceRepair'), description: t('workshop.serviceRepairDesc') },
              { icon: <Tools className="h-10 w-10" />, title: t('workshop.serviceMaintenance'), description: t('workshop.serviceMaintenanceDesc') },
              { icon: <Award className="h-10 w-10" />, title: t('workshop.serviceCustomization'), description: t('workshop.serviceCustomizationDesc') },
            ].map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('workshop.whyChoose')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('workshop.whyChooseDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
            {[
              { icon: <Check className="h-6 w-6" />, title: t('workshop.certified'), description: t('workshop.certifiedDesc') },
              { icon: <Clock className="h-6 w-6" />, title: t('workshop.quickService'), description: t('workshop.quickServiceDesc') },
              { icon: <Award className="h-6 w-6" />, title: t('workshop.qualityParts'), description: t('workshop.qualityPartsDesc') },
              { icon: <Tools className="h-6 w-6" />, title: t('workshop.modernEquipment'), description: t('workshop.modernEquipmentDesc') },
              { icon: <Phone className="h-6 w-6" />, title: t('workshop.support'), description: t('workshop.supportDesc') },
              { icon: <Award className="h-6 w-6" />, title: t('workshop.warranty'), description: t('workshop.warrantyDesc') },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full text-primary mr-4 mt-1 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('workshop.gallery')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('workshop.galleryDescription')}
            </p>
          </div>
          
          <div className="px-10">
            <Carousel>
              <CarouselContent>
                {[1, 2, 3, 4, 5].map((item) => (
                  <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <img 
                        src={`/workshop-${item}.jpg`} 
                        alt={`Workshop Gallery ${item}`}
                        className="rounded-md w-full aspect-video object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-152710945255${item}-bcdc7c283ce7?q=80&w=500`;
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2" />
              <CarouselNext className="-right-2" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('workshop.readyToStart')}</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t('workshop.readyToStartDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/contact')}>
              {t('workshop.contactUs')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate('/register')}>
              {t('workshop.register')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Workshop;
