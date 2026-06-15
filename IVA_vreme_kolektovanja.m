%% Read CVS file
tracking_data = readtable("input_data/Iva_Research - Ulazni.csv");
idx = find(tracking_data.VisitorUUID == "hidden"); % Eliminisem moje podatke
tracking_data(idx,:) = [];
idx = find(tracking_data.VisitorUUID == "undefined"); % Eliminisem undifinied users
tracking_data(idx,:) = [];
idx = find(strcmp(tracking_data.panoid, '')); % strcmp (compare strings) % Eliminisem neodredjene panorame
tracking_data(idx,:) = [];

%% Number of visitors
n_visitors = length( unique(tracking_data.VisitorUUID) );

%% Eliminisanje posetilaca koji su gledali panorame manje od 10 sekundi
unique_UUID = unique(tracking_data.VisitorUUID);
for i = 1 : length(unique_UUID)
    idx = find(string(tracking_data.VisitorUUID) == unique_UUID(i));
    if length(idx) <= 5
        tracking_data(idx,:) = [];       
    end
end

% Sortiramo po vremenu posete 
tracking_data = sortrows(tracking_data, 'Timestamp');
redundant = find(strcmp(tracking_data.panoid, '')); % strcmp (compare strings)
tracking_data(redundant, :) = [];

% Ukupno vreme gledanja u sekundama
t1 = min(tracking_data.Timestamp);
t2 = max(tracking_data.Timestamp);
t11 = datevec(datenum(t1));
t22 = datevec(datenum(t2));
time_interval_in_seconds = etime(t22,t11);