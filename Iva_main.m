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

%% Odredjivanje najgledanije panorame - overal calculated from all values and all users
tracking_data_sort_by_pano = sortrows(tracking_data, 'panoid');
[B,ia,ic] = unique(tracking_data_sort_by_pano.panoid);
panorama_count = accumarray(ic,1);
most_visited_pano = array2table([string(B), panorama_count]);
most_visited_pano.Var2 = cellfun(@str2num,most_visited_pano.Var2);
most_visited_pano = sortrows(most_visited_pano,2,"descend");

% Exctracting only first 27 panos
% most_visited_pano(27:end, :) = [];

% Naming panos from Pa1 to PaF
str_panos = repelem("Pa", length(most_visited_pano.Var1))';
num_panos = string([1 : length(most_visited_pano.Var1)]');
names = strcat(str_panos, num_panos);
data = [names, string(most_visited_pano.Var1), most_visited_pano.Var2];

%% Odredjivanje najgledanijeg dela na panorami - overal calculated from all values and all users
clf
img_name = "node_17.jpg" ;
node_id = "node17" ;
k = find(strcmp(tracking_data_sort_by_pano.panoid, node_id));
specific_pano = tracking_data_sort_by_pano(k , :);
node = [specific_pano.X specific_pano.Y specific_pano.FoV];

%% Crtaj panoramu
draw_panorama = IVA_draw_panorama(k, specific_pano, img_name, node_id);
% Sortiramo matricu prema vrednostima na x osi od najvece do najmanje
node = sortrows(node,1);
node(:, 1) = 8193 + node(:, 1);
node(:, 2) = 4096 + node(:, 2);
x = node(:, 1);
y = node(:, 2);
fov = node(:, 3);
% Racunamo razlike u distanci tacaka
distance_x = diff(x);
result = find(distance_x == 0);
mean_d_x = mean(distance_x);


%% drawing rectangles with partial groups of values of the closest x coordinates
indices = IVA_f_panorama_cases(node_id);
fov_percent = fov * (100 /  deg2rad(180) );
rect_y = round(fov_percent * (8192 / 100));
region_x = round(x - (rect_y/2));
region_y = round(y - (rect_y/2));

i = 1;
n = length(indices);
for i = 1 : n
    scatter(x(indices(i)), y(indices(i)), 20, "red","filled");
    hold on;
    rectangle('Position', [region_x(indices(i)), region_y(indices(i)), rect_y(indices(i)) rect_y(indices(i))],'LineWidth', 1,'EdgeColor', 'g');
    hold on;
end
mean(fov(indices)) % srednja vrednost fov-a odabranih vrednosti
%________________________________________________________________________________%

% drawing ONE rectangle with mean values of x, y, and fov
fov_percent = mean(fov(indices) * (100 /  deg2rad(180) ));
rect_y = round(fov_percent * (8192 / 100));
region_x = round(mean(x(indices) - (rect_y/2)));
region_y = round(mean(y(indices) - (rect_y/2)));

scatter(mean(x(indices)),mean(y(indices)), 30, "red","filled");
hold on;
rectangle('Position', [region_x, region_y, rect_y rect_y],'LineWidth', 1,'EdgeColor', 'r');
hold on;



