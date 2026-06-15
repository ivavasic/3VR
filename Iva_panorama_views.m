%% Read CVS file
tracking_data = readtable("input_data/Iva_Research - Ulazni.csv");
idx = find(tracking_data.VisitorUUID == "hidden"); % Eliminisem moje podatke
tracking_data(idx,:) = [];
idx = find(tracking_data.VisitorUUID == "undefined"); % Eliminisem undifinied users
tracking_data(idx,:) = [];
idx = find(strcmp(tracking_data.panoid, '')); % strcmp (compare strings) % Eliminisem neodredjene panorame
tracking_data(idx,:) = [];

%% Odredjivanje najgledanije panorame - overal calculated from all values and all users
tracking_data_sort_by_pano = sortrows(tracking_data, 'panoid');
redundant = find(strcmp(tracking_data_sort_by_pano.panoid, '')); % strcmp (compare strings)
tracking_data_sort_by_pano(redundant, :) = [];
[B,ia,ic] = unique(tracking_data_sort_by_pano.panoid);
panorama_count = accumarray(ic,1);
most_visited_pano = array2table([string(B), panorama_count]);
most_visited_pano.Var2 = cellfun(@str2num,most_visited_pano.Var2);

most_visited_pano = sortrows(most_visited_pano,2,"descend");
% Naming panos from Pa1 to PaF
str_panos = repelem("Pa", length(most_visited_pano.Var1))';
num_panos = string([1 : length(most_visited_pano.Var1)]');
names = strcat(str_panos, num_panos);
data = [names, string(most_visited_pano.Var1), most_visited_pano.Var2];
% Exctracting only first 27 panos
data(27:end, :) = [];

%% Histogram
X = categorical(data(:, 1)); % panoramas with views of >= 100 by all users
Y = str2double(data(:, 3));
% draw histogram
scrsz = get(0,'ScreenSize');
set(gcf, 'PaperUnits','centimeters', 'PaperSize',[210 297],...
    'Position',[100 100 600 300],...
    'PaperPositionMode', 'manual',...
    'PaperPosition', [0 0 210 297]);
set(gca,  'FontName','Times New Roman');
gca.XTickLabel.FontSize = 9; gca.YTickLabel.FontSize = 9;
h = histogram('Categories', X, 'BinCounts',...
    Y, 'EdgeColor','none','FaceColor',...
    [0 .5 .5] ,'FaceAlpha', 0.8 ,...
    'Orientation','vertical',...
    'BarWidth', 0.7);
xlabel('Panoramas', 'FontSize',9, 'FontName', 'Times New Roman', 'horizontalAlignment', 'center');
ylabel('Active cumulative time recorded \newline from all users (seconds)', 'interpreter', 'tex', 'FontName', 'Times New Roman', 'fontsize', 9, 'horizontalAlignment', 'center');
grid off;