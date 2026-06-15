function tracking_data = IVA_f_convert_names_descriptors(tracking_data)
string(tracking_data.descriptor);
convertIdx = contains(string(tracking_data.descriptor), 'button_english_language');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button English language'};
convertIdx = contains(string(tracking_data.descriptor), 'button_italian_language');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button Italian language'};
convertIdx = contains(string(tracking_data.descriptor), 'button_building_open');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button Building'};
convertIdx = contains(string(tracking_data.descriptor), 'button_HD_Paintings_open');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button HD Paintings'};
convertIdx = contains(string(tracking_data.descriptor), 'button_3D_models_open');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button 3D models'};
convertIdx = contains(string(tracking_data.descriptor), 'button_Reach_us');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button Reach Us'};
convertIdx = contains(string(tracking_data.descriptor), 'button_Help_open');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button Help'};
convertIdx = contains(string(tracking_data.descriptor), 'button_thumbnail_open');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button Thumbnail menu'};
convertIdx = contains(string(tracking_data.descriptor), 'hotspot_pin_ {node');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Scene hotspot'};
convertIdx = contains(string(tracking_data.descriptor), 'map_open');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button map'};
convertIdx = contains(string(tracking_data.descriptor), 'map_title_click');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Map title'};
convertIdx = contains(string(tracking_data.descriptor), 'map_1st_floor_open');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Map 1st floor'};
convertIdx = contains(string(tracking_data.descriptor), 'map_2nd_floor_open');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Map 2nd floor'};
convertIdx = contains(string(tracking_data.descriptor), 'map_pin_node');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Map hotspot'};
convertIdx = contains(string(tracking_data.descriptor), {'icon_Annunciazione', 'icon_Ritratto','icon_St. F. riceve le stigmate', 'icon_passeggiata_amorosa'});
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Icon HD painting'};
convertIdx = contains(string(tracking_data.descriptor), {'icon_Pastorello','icon_Plate_Luis_XVI','icon_Plate_M.Antoinette',...
'icon_Reliquiario','icon_Secchiello','icon_Violin'});
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Icon 3D model'};
convertIdx = contains(string(tracking_data.descriptor), 'thumbnail_panorama_node');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Thumbnail panorama'};
convertIdx = contains(string(tracking_data.descriptor), {'pop_up_Pastorello_on',...
'pop_up_Plate Luis XVI_on','pop_up_Plate Marie Antoinette_on','pop_up_Reliquiario_on',...
'pop_up_Secchiello_on','pop_up_Violin_on'});
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Panel 3D model'};
convertIdx = contains(string(tracking_data.descriptor), {'pop_up_Annunciazione_on',...
'pop_up_Passeggiata_amorosa_on','pop_up_Ritratto_on','pop_up_St. Francesco_on'});
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Panel HD painting'};
convertIdx = contains(string(tracking_data.descriptor), {'3D_model_open'});
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button interact with a 3D model'};
convertIdx = contains(string(tracking_data.descriptor), {'button_HD_painting_description'});
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button HD painting description'};
convertIdx = contains(string(tracking_data.descriptor), {'button_HD_painting_artist'});
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button HD painting artist'};
convertIdx = contains(string(tracking_data.descriptor), {'look_closer_Annunciazione',...
'look_closer_Passegiata amorosa','look_closer_Ritratto','look_closer_St. Francesco'});
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button look closer HD painting'};
convertIdx = contains(string(tracking_data.descriptor), {'button_HD_painting_artist'});
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button HD painting artist'};
convertIdx = contains(string(tracking_data.descriptor), 'button_home');
convertIdx = find(convertIdx == 1);
tracking_data.descriptor(convertIdx) = {'Button Home'};

%% Delete descriptors that are not mentioned in the paper
idx = contains(string(tracking_data.descriptor), {'Button 3D models','Button Building','Button English language',...
'Button HD Painting','Button HD painting artist','Button HD painting description',...
'Button Help','Button Home','Button Italian language','Button Reach Us',...
'Button Thumbnail menu','Button interact with a 3D model','Button look closer HD painting',...
'Button map','Icon 3D model','Icon HD painting','Map 1st floor','Map 2nd floor',...
'Map hotspot','Map title','Panel 3D model','Panel HD painting','Scene hotspot','Thumbnail panorama'});
delete_idx = find(idx == 0);
tracking_data(delete_idx, :) = [];

end