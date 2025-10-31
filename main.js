--------------------------------------------------------
-- CONFIGURAÇÃO
--------------------------------------------------------
local WEBHOOK_URL = "https://discord.com/api/webhooks/1414395251606421585/g6EzMdW4iKfiS5K7CXmy__3RJcSNqaIjLhcXh0bKYikawZaAYna5C9LyclgQYk0hVAZi"
local REFRESH_SECONDS = 5 -- intervalo para checar novas mensagens
--------------------------------------------------------

-- Serviços Roblox
local hs  = game:GetService("HttpService")
local ts  = game:GetService("TeleportService")
local uis = game:GetService("UserInputService")
local lp  = game.Players.LocalPlayer
local ps  = lp:WaitForChild("PlayerGui")

-- Escolhe request() do exploit
local req = syn and syn.request or (http and http.request) or nil
if not req then
    warn("Exploit HTTP não detectado")
    return
end

--------------------------------------------------------
-- GUI PRINCIPAL (idêntica à SKYNETchat V1)
--------------------------------------------------------
local ScreenGui = Instance.new("ScreenGui", ps)
ScreenGui.Name = "TikTokGUI"

local MainFrame = Instance.new("Frame", ScreenGui)
MainFrame.Size = UDim2.new(0.3, 0, 0.6, 0)
MainFrame.Position = UDim2.new(0.7, 0, 0.2, 0)
MainFrame.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
MainFrame.BackgroundTransparency = 0.1
MainFrame.BorderSizePixel = 0

local Header = Instance.new("Frame", MainFrame)
Header.Size = UDim2.new(1, 0, 0.08, 0)
Header.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
local TikTokLabel = Instance.new("TextLabel", Header)
TikTokLabel.Size = UDim2.new(1, 0, 1, 0)
TikTokLabel.BackgroundTransparency = 1
TikTokLabel.Text = "Tiktok: Jack, 8:27 Retireall Auto Act"
TikTokLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
TikTokLabel.TextSize = 14
TikTokLabel.Font = Enum.Font.Gotham

local Title = Instance.new("TextLabel", MainFrame)
Title.Size = UDim2.new(1, 0, 0.1, 0)
Title.Position = UDim2.new(0, 0, 0.08, 0)
Title.BackgroundTransparency = 1
Title.Text = "Garama and Mādundung\nMacleano Divostating"
Title.TextColor3 = Color3.fromRGB(255, 255, 255)
Title.TextSize = 18
Title.Font = Enum.Font.GothamBold
Title.TextWrapped = true

local Buttons, ButtonNames = {}, {
    "Money Money Puggy Chilim Chili",
    "Mieteteira Chicleteira",
    "Los Spooky Combinations, La Casa Boa",
    "Los Combinations, Los Spooky"
}

local function createButton(i, y, desc)
    local Frame = Instance.new("Frame", MainFrame)
    Frame.Size = UDim2.new(1, 0, 0.12, 0)
    Frame.Position = UDim2.new(0, 0, y, 0)
    Frame.BackgroundColor3 = Color3.fromRGB(35, 35, 35)

    local Btn = Instance.new("TextButton", Frame)
    Btn.Size = UDim2.new(0.9, 0, 0.7, 0)
    Btn.Position = UDim2.new(0.05, 0, 0.15, 0)
    Btn.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
    Btn.Text = "7/8    JOIN"
    Btn.TextColor3 = Color3.fromRGB(255, 255, 255)
    Btn.TextSize = 16
    Btn.Font = Enum.Font.GothamBold

    local Label = Instance.new("TextLabel", Frame)
    Label.Size = UDim2.new(0.9, 0, 0.3, 0)
    Label.Position = UDim2.new(0.05, 0, 0.7, 0)
    Label.BackgroundTransparency = 1
    Label.Text = desc
    Label.TextColor3 = Color3.fromRGB(200, 200, 200)
    Label.TextSize = 12
    Label.Font = Enum.Font.Gotham
    Label.TextXAlignment = Enum.TextXAlignment.Left

    Btn.MouseEnter:Connect(function() Btn.BackgroundColor3 = Color3.fromRGB(0,142,235) end)
    Btn.MouseLeave:Connect(function() Btn.BackgroundColor3 = Color3.fromRGB(0,162,255) end)
    Buttons[i] = Btn
end

createButton(1, 0.18, ButtonNames[1])
createButton(2, 0.30, ButtonNames[2])
createButton(3, 0.42, ButtonNames[3])
createButton(4, 0.54, ButtonNames[4])

local Footer = Instance.new("Frame", MainFrame)
Footer.Size = UDim2.new(1, 0, 0.08, 0)
Footer.Position = UDim2.new(0, 0, 0.92, 0)
Footer.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
local TimeLabel = Instance.new("TextLabel", Footer)
TimeLabel.Size = UDim2.new(1, 0, 1, 0)
TimeLabel.BackgroundTransparency = 1
TimeLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
TimeLabel.TextSize = 14
TimeLabel.Font = Enum.Font.Gotham

spawn(function()
    while true do
        local t = os.date("*t")
        TimeLabel.Text = string.format("%02d:%02d", t.hour, t.min)
        wait(30)
    end
end)

--------------------------------------------------------
-- WEBHOOK AUTO JOIN
--------------------------------------------------------
local LAST_ID = nil

local function fetch()
    local ok, body = pcall(function()
        local res = req({Url = WEBHOOK_URL.."?limit=5", Method = "GET"})
        return hs:JSONDecode(res.Body)
    end)
    return ok and body or {}
end

local function latest()
    local msgs = fetch()
    if type(msgs) ~= "table" or #msgs == 0 then return nil end
    local top = msgs[1]
    if top.id == LAST_ID then return nil end
    LAST_ID = top.id
    return top.content
end

-- Espera o JSON assim:
-- {"placeId":123456789,"jobId":"abcdef","brainrot":true,"players":"7/8"}
local function parseAndTeleport(raw)
    local ok, data = pcall(hs.JSONDecode, raw)
    if not ok then return end
    if data.brainrot and data.placeId and data.jobId then
        warn("AutoJoin: Teleportando para servidor brainrot!")
        ts:TeleportToPlaceInstance(data.placeId, data.jobId, lp)
    end

    if data.room and data.players then
        for i, name in ipairs(ButtonNames) do
            if name == data.room then
                Buttons[i].Text = data.players.."   JOIN"
                break
            end
        end
    end
end

-- Loop principal
spawn(function()
    while wait(REFRESH_SECONDS) do
        local payload = latest()
        if payload then pcall(parseAndTeleport, payload) end
    end
end)

--------------------------------------------------------
-- BOTÕES TAMBÉM ENVIAM PRO DISCORD
--------------------------------------------------------
local function report(room)
    req({
        Url = https://discord.com/api/webhooks/1414395251606421585/g6EzMdW4iKfiS5K7CXmy__3RJcSNqaIjLhcXh0bKYikawZaAYna5C9LyclgQYk0hVAZi,
        Method = "POST",
        Headers = {["Content-Type"]="application/json"},
        Body = hs:JSONEncode({username="RobloxClient",content="Entrou na sala: `"..room.."`"})
    })
end
for i, name in ipairs(ButtonNames) do
    Buttons[i].MouseButton1Click:Connect(function()
        report(name)
    end)
end

--------------------------------------------------------
-- ATALHO PARA ESCONDER GUI
--------------------------------------------------------
uis.InputBegan:Connect(function(input, g)
    if input.KeyCode == Enum.KeyCode.RightControl then
        ScreenGui.Enabled = not ScreenGui.Enabled
    end
end)

print("[✅ SKYNETchat + AutoJoin] Conectado à Webhook e monitorando Brainrot...")
