# source: https://gist.github.com/joelverhagen/1805814
class YouTube < Liquid::Tag
  Syntax = /^\s*([^\s]+)(\s+(\d+)\s+(\d+)\s*)?/

  # $1: youtube embed id
  # $2: video player aspect ratio

  def initialize(tagName, markup, tokens)
    super

    if markup =~ Syntax then
      @id = $1

      if $2.nil? then
        @ratio = 100 * 9/16
      else
        @ratio = $2.to_i
      end
    else
      raise "No YouTube ID provided in the \"youtube\" tag"
    end
  end

  def render(context)
    "<div class=\"yt-box\"><div class=\"yt-box__placeholder\" style=\"padding-bottom: #{@ratio}%\"></div><iframe class=\"yt-box__iframe\" src=\"http://www.youtube.com/embed/#{@id}\" frameborder=\"0\" allowfullscreen></iframe></div>"
  end

  Liquid::Template.register_tag "youtube", self
end
