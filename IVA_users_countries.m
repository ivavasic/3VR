%% Read CVS file
tracking_data = readtable("input_data/Iva_Research - Ulazni.csv");
idx = find(tracking_data.VisitorUUID == "hidden"); % Eliminisem moje podatke
tracking_data(idx,:) = [];
idx = find(tracking_data.VisitorUUID == "undefined"); % Eliminisem undifinied users
tracking_data(idx,:) = [];
idx = find(strcmp(tracking_data.panoid, '')); % strcmp (compare strings) % Eliminisem neodredjene panorame
tracking_data(idx,:) = [];

%% Countries
% Picking up IPs and obtaining countries
IPs = string(unique(tracking_data.userip));
unique_ips_n = length(IPs);
all_countries = "";
m = 1;
    for m = 1 : unique_ips_n
        if ( IPs(m) ~= "0.0.0.0" )
            % Konvertovanje IP adrese u drzavu 
            country = getCountryByIP(IPs(m));
            all_countries = [all_countries; country];
            m = m + 1;
        else
            m = m + 1;
        end
     end

     % Koliko korisnika po drzavi
     all_countries(1) = [];
     [C,ia,ic] = unique(all_countries);
     country_count = accumarray(ic,1);
     value_counts = [C, country_count];

%% Picking up UUIDs
UUIDs = unique(tracking_data.VisitorUUID);
% Convert values to strings
UUIDs = cellstr(UUIDs);
% koliko UUIDs toliko korisnika
users_n = length(UUIDs);

%% Histogram
% Data
X = value_counts(:, 1);
Y = str2double(value_counts(:, 2));
% draw histogram
scrsz = get(0,'ScreenSize');
set(gcf,'WindowStyle','normal','Renderer','painters',...
    'Position',[(scrsz(3)/2-300) -(scrsz(4)/2-150) 8192 16386],...
    'PaperPositionMode', 'manual','PaperUnits','centimeters',...
    'PaperSize',[289 577.991],'PaperPosition', [0 0 289 577.991],...
    'Color',[1,1,1]);
h = histogram('Categories', X, 'BinCounts',...
    Y, 'EdgeColor','none','FaceColor',...
    [0 .5 .5] ,'FaceAlpha', 0.8 ,...
    'Orientation','vertical');
xlabel('Country');
ylabel('Number of visitors');
set(gca, 'FontSize', 12);
grid off;

% Total number of visitors and countries
total_vis = sum(Y);
total_country = length(unique(X));