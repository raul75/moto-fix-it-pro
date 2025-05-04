
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Camera } from 'lucide-react';
import { repairs } from '@/data/mockData';

const PhotosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get all photos from all repairs
  const allPhotos = repairs.flatMap(repair => 
    repair.photos.map(photo => ({
      ...photo,
      repairTitle: repair.title,
      repairId: repair.id
    }))
  );
  
  // Filter photos based on search term
  const filteredPhotos = allPhotos.filter(photo => {
    const searchLower = searchTerm.toLowerCase();
    return (
      photo.repairTitle.toLowerCase().includes(searchLower) ||
      (photo.caption || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Documentazione Fotografica</h1>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca foto..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex gap-1">
            <Camera className="h-4 w-4" />
            Carica Foto
          </Button>
        </div>
      </div>

      {allPhotos.length === 0 ? (
        <div className="text-center py-16">
          <Camera className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
          <h2 className="mt-4 text-xl font-semibold">Nessuna foto disponibile</h2>
          <p className="mt-2 text-muted-foreground">
            Carica delle foto per documentare i tuoi lavori di riparazione.
          </p>
          <Button className="mt-6">
            <Camera className="mr-2 h-4 w-4" />
            Carica prima foto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPhotos.map(photo => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={photo.url}
                  alt={photo.caption || 'Foto riparazione'}
                  className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                />
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">
                  {photo.caption || 'Nessuna descrizione'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {photo.repairTitle}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(photo.dateAdded).toLocaleDateString('it-IT')}
                </p>
              </CardContent>
            </Card>
          ))}
          
          {filteredPhotos.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Nessuna foto trovata.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default PhotosPage;
